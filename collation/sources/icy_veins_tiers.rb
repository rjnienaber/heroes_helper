module Sources
  class IcyVeinsTiers < Base
    def values
      @tiers ||= get_tiers
    end

    private

    def get_tiers
      page = browser.download_page('https://www.icy-veins.com/forums/topic/35069-hanzo-meta-tier-list-december-2017/', 'icy_veins_tiers')
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

      cho_gall_key = 'gall';
      values.delete('Varian (Damage)')
      values.delete('Varian (Tank)')

      values['Varian'] = 'Core Tier'
      values
    end
  end
end