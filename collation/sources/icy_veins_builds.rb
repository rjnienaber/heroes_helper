module Sources
  class IcyVeinsBuilds < Base

    def values
      @builds ||= get_builds
    end

    private 

    def get_builds
      pages = hero_build_urls.map { |url, cache_name| browser.download_page(url, cache_name) }
      Hash[pages.map do |page|
        title = page.css('.page_title').text.strip
        hero = /(.*) Build Guide/.match(title)[1]
        [hero, page]
      end]
    end

    BUILD_URLS = %w[
http://www.icy-veins.com/heroes/abathur-build-guide
http://www.icy-veins.com/heroes/alarak-build-guide
http://www.icy-veins.com/heroes/alexstrasza-build-guide
http://www.icy-veins.com/heroes/ana-build-guide
http://www.icy-veins.com/heroes/anubarak-build-guide
http://www.icy-veins.com/heroes/artanis-build-guide
http://www.icy-veins.com/heroes/arthas-build-guide
http://www.icy-veins.com/heroes/auriel-build-guide
http://www.icy-veins.com/heroes/azmodan-build-guide
http://www.icy-veins.com/heroes/brightwing-build-guide
http://www.icy-veins.com/heroes/cassia-build-guide
http://www.icy-veins.com/heroes/chen-build-guide
http://www.icy-veins.com/heroes/cho-build-guide
http://www.icy-veins.com/heroes/chromie-build-guide
http://www.icy-veins.com/heroes/dehaka-build-guide
http://www.icy-veins.com/heroes/diablo-build-guide
http://www.icy-veins.com/heroes/dva-build-guide
http://www.icy-veins.com/heroes/e-t-c-build-guide
http://www.icy-veins.com/heroes/falstad-build-guide
http://www.icy-veins.com/heroes/gall-build-guide
http://www.icy-veins.com/heroes/garrosh-build-guide
http://www.icy-veins.com/heroes/gazlowe-build-guide
http://www.icy-veins.com/heroes/genji-build-guide
http://www.icy-veins.com/heroes/greymane-build-guide
http://www.icy-veins.com/heroes/guldan-build-guide
http://www.icy-veins.com/heroes/hanzo-build-guide
http://www.icy-veins.com/heroes/illidan-build-guide
http://www.icy-veins.com/heroes/jaina-build-guide
http://www.icy-veins.com/heroes/johanna-build-guide
http://www.icy-veins.com/heroes/junkrat-build-guide
http://www.icy-veins.com/heroes/kaelthas-build-guide
http://www.icy-veins.com/heroes/kel-thuzad-build-guide
http://www.icy-veins.com/heroes/kerrigan-build-guide
http://www.icy-veins.com/heroes/kharazim-build-guide
http://www.icy-veins.com/heroes/leoric-build-guide
http://www.icy-veins.com/heroes/li-li-build-guide
http://www.icy-veins.com/heroes/li-ming-build-guide
http://www.icy-veins.com/heroes/lt-morales-build-guide
http://www.icy-veins.com/heroes/lucio-build-guide
http://www.icy-veins.com/heroes/lunara-build-guide
http://www.icy-veins.com/heroes/malfurion-build-guide
http://www.icy-veins.com/heroes/malthael-build-guide
http://www.icy-veins.com/heroes/medivh-build-guide
http://www.icy-veins.com/heroes/muradin-build-guide
http://www.icy-veins.com/heroes/murky-build-guide
http://www.icy-veins.com/heroes/nazeebo-build-guide
http://www.icy-veins.com/heroes/nova-build-guide
http://www.icy-veins.com/heroes/probius-build-guide
http://www.icy-veins.com/heroes/ragnaros-build-guide
http://www.icy-veins.com/heroes/raynor-build-guide
http://www.icy-veins.com/heroes/rehgar-build-guide
http://www.icy-veins.com/heroes/rexxar-build-guide
http://www.icy-veins.com/heroes/samuro-build-guide
http://www.icy-veins.com/heroes/sgt-hammer-build-guide
http://www.icy-veins.com/heroes/sonya-build-guide
http://www.icy-veins.com/heroes/stitches-build-guide
http://www.icy-veins.com/heroes/stukov-build-guide
http://www.icy-veins.com/heroes/sylvanas-build-guide
http://www.icy-veins.com/heroes/tassadar-build-guide
http://www.icy-veins.com/heroes/the-butcher-build-guide
http://www.icy-veins.com/heroes/the-lost-vikings-build-guide
http://www.icy-veins.com/heroes/thrall-build-guide
http://www.icy-veins.com/heroes/tracer-build-guide
http://www.icy-veins.com/heroes/tychus-build-guide
http://www.icy-veins.com/heroes/tyrael-build-guide
http://www.icy-veins.com/heroes/tyrande-build-guide
http://www.icy-veins.com/heroes/uther-build-guide
http://www.icy-veins.com/heroes/valeera-build-guide
http://www.icy-veins.com/heroes/valla-build-guide
http://www.icy-veins.com/heroes/varian-build-guide
http://www.icy-veins.com/heroes/varian-build-guide
http://www.icy-veins.com/heroes/xul-build-guide
http://www.icy-veins.com/heroes/zarya-build-guide
http://www.icy-veins.com/heroes/zeratul-build-guide
http://www.icy-veins.com/heroes/zuljin-build-guide
http://www.icy-veins.com/heroes/zagara-build-guide]

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