module Sources
  class Prices < Base
    def values
      @prices ||= get_prices
    end

    private

    def get_prices
      page = browser.download_page('https://heroesofthestorm.gamepedia.com/Hero_Prices', 'hero_price')
      rows = page.css('#mw-content-text table tr')[1..-1]
      Hash[rows.map do |row|
        gems_and_gold = row.css('td').first.text.strip
        gems, gold = gems_and_gold.gsub(',', '').split(/ \/ /).map(&:to_i)

        heroes = row.css('td ul li a:nth-child(2)').map { |e| e.text }
        heroes.map { |h| [h, [gems, gold]] }
      end.flatten(1)]
    end
  end
end