module Sources
  class WinPercent < Base

    private

    def retrieve_values
      page = browser.download_page('https://apiapp.hotslogs.com/API/ReplayCharacterResults/-1,-1,-1/-1', 'win_percent')
      page_json = JSON.parse(page.content)
      
      Hash[page_json['PotentialReplayCharacterQueryResultEntries'].map do |e|
        [e['Character'], (e['WinPercent'] * 100).round(1)]
      end]
    end
  end
end