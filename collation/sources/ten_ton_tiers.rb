module Sources
  class TenTonTiers < Base
    def values
      @tiers ||= get_tiers
    end

    private

    def get_tiers
      page = browser.download_page('http://www.tentonhammer.com/articles/heroes-of-the-storm-tier-list', 'ten_ton_tiers')
      rows = page.css('div.field-type-text-with-summary > table:nth-child(33) tr')

      current_tier = nil
      values = Hash[rows.map do |row|
        row_text = row.text.strip
        # binding.pry if current_tier.nil?
        if row_text.end_with?('Tier')
          current_tier = row_text.gsub(" ", ' ')
          next
        end

        # find hero
        hero = row.css('strong a').text
        
        [hero, current_tier]
      end.compact]

      # clean up
      cho_gall_key = 'Cho\'gall';
      cho_gall = values.delete(cho_gall_key)
      values['Cho'] = cho_gall
      values['Gall'] = cho_gall
      
      values['E.T.C.'] = values.delete('E.T.C')
      values['Lúcio'] = values.delete('Lucio')
      values['Gul\'dan'] = values.delete('Guldan')
      values['Maiev'] = values.delete('Maeve')

      values
    end
  end
end