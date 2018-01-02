module Sources
  class Roles < Base
    def values
      @roles ||= get_roles
    end

    private

    def get_roles
      page = browser.download_page('http://us.battle.net/heroes/en/heroes/#/', 'hero_role')
      match = /window.heroes = (.*);/.match(page.content)
      json = match[1]
      data = JSON.parse(json)
      values = Hash[data.map { |d| [d['name'], d['role']['name']]}]

      values.delete("Cho'gall")
      values['Cho'] = 'Warrior'
      values['Gall'] = 'Assassin'

      values
    end
  end
end