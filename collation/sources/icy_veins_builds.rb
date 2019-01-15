module Sources
  class IcyVeinsBuilds < Base

    private 

    def retrieve_values
      pages = hero_build_urls.map do |url, cache_name| 
        page = nil
        while page.nil?
          begin
            page = browser.download_page(url, cache_name) 
          rescue Net::ReadTimeout => e
            p e
            browser.reset
          end
        end
        page
      end
      Hash[pages.map do |page|
        title = page.css('.page_title').text.strip
        hero = /(.*) Build Guide/.match(title)[1]
        [hero, page]
      end]
    end

    BUILD_URLS = %w[
https://www.icy-veins.com/heroes/abathur-build-guide
https://www.icy-veins.com/heroes/alarak-build-guide
https://www.icy-veins.com/heroes/alexstrasza-build-guide
https://www.icy-veins.com/heroes/ana-build-guide
https://www.icy-veins.com/heroes/anubarak-build-guide
https://www.icy-veins.com/heroes/artanis-build-guide
https://www.icy-veins.com/heroes/arthas-build-guide
https://www.icy-veins.com/heroes/auriel-build-guide
https://www.icy-veins.com/heroes/azmodan-build-guide
https://www.icy-veins.com/heroes/blaze-build-guide
https://www.icy-veins.com/heroes/brightwing-build-guide
https://www.icy-veins.com/heroes/cassia-build-guide
https://www.icy-veins.com/heroes/chen-build-guide
https://www.icy-veins.com/heroes/cho-build-guide
https://www.icy-veins.com/heroes/chromie-build-guide
https://www.icy-veins.com/heroes/deckard-build-guide
https://www.icy-veins.com/heroes/dehaka-build-guide
https://www.icy-veins.com/heroes/diablo-build-guide
https://www.icy-veins.com/heroes/dva-build-guide
https://www.icy-veins.com/heroes/e-t-c-build-guide
https://www.icy-veins.com/heroes/falstad-build-guide
https://www.icy-veins.com/heroes/fenix-build-guide
https://www.icy-veins.com/heroes/gall-build-guide
https://www.icy-veins.com/heroes/garrosh-build-guide
https://www.icy-veins.com/heroes/gazlowe-build-guide
https://www.icy-veins.com/heroes/genji-build-guide
https://www.icy-veins.com/heroes/greymane-build-guide
https://www.icy-veins.com/heroes/guldan-build-guide
https://www.icy-veins.com/heroes/hanzo-build-guide
https://www.icy-veins.com/heroes/illidan-build-guide
https://www.icy-veins.com/heroes/imperius-build-guide
https://www.icy-veins.com/heroes/jaina-build-guide
https://www.icy-veins.com/heroes/johanna-build-guide
https://www.icy-veins.com/heroes/junkrat-build-guide
https://www.icy-veins.com/heroes/kaelthas-build-guide
https://www.icy-veins.com/heroes/kel-thuzad-build-guide
https://www.icy-veins.com/heroes/kerrigan-build-guide
https://www.icy-veins.com/heroes/kharazim-build-guide
https://www.icy-veins.com/heroes/leoric-build-guide
https://www.icy-veins.com/heroes/li-li-build-guide
https://www.icy-veins.com/heroes/li-ming-build-guide
https://www.icy-veins.com/heroes/lt-morales-build-guide
https://www.icy-veins.com/heroes/lucio-build-guide
https://www.icy-veins.com/heroes/lunara-build-guide
https://www.icy-veins.com/heroes/malfurion-build-guide
https://www.icy-veins.com/heroes/malganis-build-guide
https://www.icy-veins.com/heroes/malthael-build-guide
https://www.icy-veins.com/heroes/maiev-build-guide
https://www.icy-veins.com/heroes/medivh-build-guide
https://www.icy-veins.com/heroes/mephisto-build-guide
https://www.icy-veins.com/heroes/muradin-build-guide
https://www.icy-veins.com/heroes/murky-build-guide
https://www.icy-veins.com/heroes/nazeebo-build-guide
https://www.icy-veins.com/heroes/nova-build-guide
https://www.icy-veins.com/heroes/orphea-build-guide
https://www.icy-veins.com/heroes/probius-build-guide
https://www.icy-veins.com/heroes/ragnaros-build-guide
https://www.icy-veins.com/heroes/raynor-build-guide
https://www.icy-veins.com/heroes/rehgar-build-guide
https://www.icy-veins.com/heroes/rexxar-build-guide
https://www.icy-veins.com/heroes/samuro-build-guide
https://www.icy-veins.com/heroes/sgt-hammer-build-guide
https://www.icy-veins.com/heroes/sonya-build-guide
https://www.icy-veins.com/heroes/stitches-build-guide
https://www.icy-veins.com/heroes/stukov-build-guide
https://www.icy-veins.com/heroes/sylvanas-build-guide
https://www.icy-veins.com/heroes/tassadar-build-guide
https://www.icy-veins.com/heroes/the-butcher-build-guide
https://www.icy-veins.com/heroes/the-lost-vikings-build-guide
https://www.icy-veins.com/heroes/thrall-build-guide
https://www.icy-veins.com/heroes/tracer-build-guide
https://www.icy-veins.com/heroes/tychus-build-guide
https://www.icy-veins.com/heroes/tyrael-build-guide
https://www.icy-veins.com/heroes/tyrande-build-guide
https://www.icy-veins.com/heroes/uther-build-guide
https://www.icy-veins.com/heroes/valeera-build-guide
https://www.icy-veins.com/heroes/valla-build-guide
https://www.icy-veins.com/heroes/varian-build-guide
https://www.icy-veins.com/heroes/varian-build-guide
https://www.icy-veins.com/heroes/whitemane-build-guide
https://www.icy-veins.com/heroes/xul-build-guide
https://www.icy-veins.com/heroes/yrel-build-guide
https://www.icy-veins.com/heroes/zarya-build-guide
https://www.icy-veins.com/heroes/zeratul-build-guide
https://www.icy-veins.com/heroes/zuljin-build-guide
https://www.icy-veins.com/heroes/zagara-build-guide]

    def hero_build_urls
      BUILD_URLS.map do |url|
        [url, cache_name_from_url(url)]
      end
    end

    def cache_name_from_url(url)
      "icy_veins/#{url.split('/').last}"
    end
  end
end