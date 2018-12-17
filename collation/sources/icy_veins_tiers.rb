module Sources
  class IcyVeinsTiers < Base

    private

    def retrieve_values
      page = browser.download_page('https://www.icy-veins.com/forums/topic/40514-malganis-meta-tier-list-november-2018/', 'icy_veins_tiers')
      heroes_list = page.css('p + table')

      values = Hash[heroes_list.map do |heroes|
        node = heroes.previous.previous
        tier = node.text.strip

        heroes.css('tbody td a').map do |hero|
          [hero.text, tier]
        end
      end.flatten(1)]

      # clean up
      cho_gall_key = 'gall';
      cho_gall = values.delete(cho_gall_key)
      values['Cho'] = cho_gall
      values['Gall'] = cho_gall

      values.keys.each do |key|
        next unless values[key] == " "
        values[key] = 'Situational picks (map, team composition, or counterpick)'
      end

      values
    end
  end
end