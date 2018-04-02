module Sources
  class SubRoles < Base

    private

    def retrieve_values
      page = browser.download_page('https://www.hotslogs.com/Info/HeroSubRole', 'hero_subrole')
      tables = page.css('section.about table')
      Hash[tables.map do |table|
        role, *heroes = table.css('tr').map { |e| e.text}
        heroes.map { |h| [h, role]}
      end.flatten(1)]
    end
  end
end