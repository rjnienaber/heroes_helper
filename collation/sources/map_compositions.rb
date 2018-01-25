require 'watir'

module Sources
  class MapCompositions < Base
    def values
      @map_compositions ||= get_map_compositions
    end

    private

    def cache_dir
      "#{self.browser.cache_dir}/map_compositions"
    end

    def get_map_compositions
      # go to team composition page
      content = browser.perform(cache_dir, 'all') do |b|
        b.goto('https://www.hotslogs.com/Sitewide/TeamCompositions')
        b.html
      end 

      page = Nokogiri::HTML(content)
      items = page.css('#ctl00_MainContent_DropDownMapName_DropDown .rddlList li')
      
      Hash[items.map do |item|
        map_name = item.text
        page = get_map(map_name)
        rows = page.css('.rgMasterTable tbody tr')


        values = rows.map do |row| 
          cells = row.css('td')
          count, win_percent, *roles = cells
          [
            count.text.gsub(',','').to_i,
            win_percent.text.gsub('%','').to_f,
            roles[0..4].map { |r| r.text}
          ]
        end.select { |v| v[2].any? { |r| ['Healer', 'Support'].include?(r) } } # must have healer/support

        total = values.reduce(0) { |sum, v| sum + v[0] }
        winning_compositions = values.select { |v| v[1] >= 50 && (v[0] / total.to_f) > 0.01 }
                                     .sort_by { |v| v[1] }.reverse
        

        [
          map_name,
          winning_compositions[0..9].map { |v| {count: v[0], win_percent: v[1], roles: v[2]}}
        ]
      end.select { |m| m[1].length != 0}]
    end

    def get_map(map_name)
      cache_name = map_name.downcase.gsub(' ', '_').gsub(/[^A-z]/, '')
      content = browser.perform(cache_dir, cache_name) do |b|
        unless b.url.include?('TeamCompositions')
          b.goto('https://www.hotslogs.com/Sitewide/TeamCompositions')
        end

        # browser.goto('https://www.hotslogs.com/Sitewide/TeamCompositions')
        b.element(id: 'ctl00_MainContent_DropDownMapName').click
        sleep 2 # wait for dropdown
        b.element(text: map_name).click
        sleep 5 # wait for ajax request
        b.html
      end

      Nokogiri::HTML(content)
    end
  end
end