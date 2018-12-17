module Sources
  class GrubbyTiers < Base

    private

    def retrieve_values
      page = browser.download_page('http://www.robogrub.com/tierlist_api', 'grubby_tiers')
      page_json = JSON.parse(page)
      values = Hash[["t2", "t1", "t3", "s"].map do |tier|
        tier_text = "#{tier.upcase} Tier"
        heroes = page_json[tier]
        heroes.map { |hero| [hero['id'], tier_text]}
      end.flatten(1)]

      values
    end
  end
end