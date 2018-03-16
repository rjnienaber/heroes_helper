module Sources
  class WinPercent < Base
    def values
      @win_percent ||= get_win_percent
    end

    private

    def get_win_percent
      page = browser.download_page('https://apiapp.hotslogs.com/API/ReplayCharacterResults/-1,-1,-1/-1', 'win_percent')
      page_json = JSON.parse(page.content)
      
      Hash[page_json['PotentialReplayCharacterQueryResultEntries'].map do |e|
        [e['Character'], (e['WinPercent'] * 100).round(1)]
      end]
    end
  end
end