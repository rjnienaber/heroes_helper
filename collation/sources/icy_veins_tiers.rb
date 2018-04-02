module Sources
  class IcyVeinsTiers < Base

    private

    def retrieve_values
      page = browser.download_page('https://www.icy-veins.com/forums/topic/36433-medivh-sonya-rework-meta-tier-list-march-2018/', 'icy_veins_tiers')
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

      # clean up
      cho_gall_key = 'gall';
      cho_gall = values.delete(cho_gall_key)
      values['Cho'] = cho_gall
      values['Gall'] = cho_gall
      
      values.delete('Varian (Taunt)')
      values.delete('Varian (Colossus Smash)')
      values.delete('Varian (Twin Blades of Fury)')
      values['Varian'] = 'Core Tier'
      
      values['Fenix'] = 'Core  Tier' # hard coded to ten ton tiers as missing

      values
    end
  end
end