module Sources
  class GrubbyTiers < Base
    def values
      @tiers ||= get_tiers
    end

    private

    def get_tiers
      page = browser.download_page('http://www.robogrub.com/tierlist', 'grubby_tiers')
      tiers = page.css('#tierlist .tier')
      Hash[tiers.map do |tier_div|
        tier = "#{tier_div.attributes['id'].value.upcase} Tier"
        tier_div.css('img.tierhero').map do |image|
          hero = image.attributes['title'].value.strip
          hero = 'The Butcher' if hero == 'Butcher'
          hero = 'D.Va' if hero == 'D.VA'
          hero = 'The Lost Vikings' if hero == 'Lost Vikings'
          hero = 'Lúcio' if hero == 'Lucio'
          hero = 'Zul\'jin' if hero == 'Zul\'Jin'
          hero = 'Junkrat' if hero == 'junkrat'
          hero = 'Zarya' if hero == 'zarya'
          [hero, tier]
        end
      end.flatten(1)]
    end
  end
end