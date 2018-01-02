module Sources
  class TenTonTiers < Base
    def values
      @tiers ||= get_tiers
    end

    private

    def get_tiers
      page = browser.download_page('http://www.tentonhammer.com/articles/heroes-of-the-storm-tier-list', 'ten_ton_tiers')
      tables = page.css('div.field-type-text-with-summary table')[1..-1]
      values = Hash[tables.map do |table|
        next unless table.text && table.text.include?('Tier')
        next if table.text.include?('C Tier')

        tier = table.css('th:nth-child(1)').first.text.strip
        rows = table.css('tbody tr')
        rows.map do |row|
          hero, _, _, difficulty, description = row.css('td').map { |td| td.text }
          [hero, [tier, difficulty, description.strip]]
        end
      end.flatten(1).compact]

      # clean up
      cho_gall_key = 'Cho\'gall';
      cho_gall = values.delete(cho_gall_key)
      values['Cho'] = cho_gall
      values['Gall'] = cho_gall
      
      values['E.T.C.'] = values.delete('E.T.C')
      values['Lúcio'] = values.delete('Lucio')
      values['Medivh'] = values.delete('Medivh*')
      values['The Lost Vikings'] = values.delete('T.L.V*')
      values['The Butcher'] = values.delete('The Butcher*')

      values
    end
  end
end