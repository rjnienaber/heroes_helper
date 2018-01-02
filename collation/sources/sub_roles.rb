module Sources
  class SubRoles < Base
    def values
      @roles ||= get_roles
    end

    private

    def get_roles
      page = browser.download_page('https://www.hotslogs.com/Info/HeroSubRole', 'hero_subrole')
      tables = page.css('section.about table')
      Hash[tables.map do |table|
        role, *heroes = table.css('tr').map { |e| e.text}
        heroes.map { |h| [h, role]}
      end.flatten(1)]
    end
  end
end