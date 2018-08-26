module Sources
  class IcyVeinsTiers < Base

    private

    def retrieve_values
      page = browser.download_page('https://www.icy-veins.com/forums/topic/38542-raynor-azmodan-rework-meta-tier-list-july-2018/', 'icy_veins_tiers')
      heroes_list = page.css('p + table')
      # binding.pry
      values = Hash[heroes_list.map do |heroes|
        node = heroes.previous.previous
        node = node.previous.previous if !node.text.downcase.include?('tier')
        tier = node.text.strip

        heroes.css('tbody td a').map do |hero|
          [hero.text, tier]
        end
      end.flatten(1)]

      values['Genji'] = 'Meta picks'
      values['Raynor'] = 'Meta picks'
      values['Deckard'] = 'Meta picks'
      values['Cho'] = 'Situational picks (map, team composition, or counterpick)'

      # clean up
      cho_gall_key = 'gall';
      cho_gall = values.delete(cho_gall_key)
      values['Cho'] = cho_gall
      values['Gall'] = cho_gall

      values.keys.each do |key|
        next unless values[key] == " "
        values[key] = 'Situational picks (map, team composition, or counterpick)'
      end


      values['Whitemane'] = 'High-tier generalists'
      p values
      # High-tier generalists
      values
    end
  end
end