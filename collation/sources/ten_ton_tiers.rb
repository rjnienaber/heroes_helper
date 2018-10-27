module Sources
  class TenTonTiers < Base
    private

    def retrieve_values
      page = browser.download_page('http://www.tentonhammer.com/articles/heroes-of-the-storm-tier-list', 'ten_ton_tiers')
      elements = page.css('div.field-type-text-with-summary').children
      values = {}

      elements.each_with_index do |element, i|
        next unless element.text.strip.end_with?('Tier', 'Tier *')
        tier = element.text.strip
        heroes = elements[i + 2].css('td img')
        heroes.map do |img|
          img_src = img.attributes['src'].value
          hero = /.*\/(.*).png/.match(img_src)[1]
          values[hero] = tier
        end
      end

      # clean up
      cho_gall_key = 'Chogall';
      cho_gall = values.delete(cho_gall_key)
      values['Cho'] = cho_gall
      values['Gall'] = cho_gall

      values['Mal\'Ganis'] = 'S Tier'
      
      values
    end
  end
end