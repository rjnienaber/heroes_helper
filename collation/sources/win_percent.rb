module Sources
  class WinPercent < Base
    def values
      @win_percent ||= get_win_percent
    end

    private

    def get_win_percent
      page = browser.download_page('https://www.hotslogs.com/Sitewide/TeamDraft', 'win_percent')
      heroes = page.css('#AvailableHeroes li')
      Hash[heroes.map do |e|
        [e.attr('data-hero'), e.css('p.p').first.children.first.text]
      end]
    end
  end
end