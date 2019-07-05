module Sources
  class IcyVeinsTiers < Base

    def url
      'https://www.icy-veins.com/forums/topic/43323-anduin-meta-tier-list-may-2019/'
    end

    private

    def retrieve_values
      page = browser.download_page(self.url, 'icy_veins_tiers')
      heroes_list = page.css('p + table')

      values = Hash[heroes_list.map do |heroes|
        node = heroes.previous.previous
        tier = node.text.strip

        heroes.css('tbody td a').map do |hero|
          [hero.text, tier]
        end
      end.flatten(1)]

      # clean up
      cho_gall_key = 'gall'
      cho_gall = values.delete(cho_gall_key)
      values['Cho'] = cho_gall
      values['Gall'] = cho_gall

      values.keys.each do |key|
        next unless values[key] == " "
        values[key] = 'Situational picks (map, team composition, or counterpick)'
      end

      values['Imperius'] = 'Low-tier generalists'

      values
    end
  end
end