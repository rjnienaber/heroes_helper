module Sources
  class Base
    NAME_MAPPINGS = {
      ['Butcher', 'TheButcher'] => 'The Butcher',
      ['Anubarak'] => 'Anub\'arak',
      ['D.VA', 'Dva'] => 'D.Va',
      ['ETC'] => 'E.T.C.',
      ['Li-Li'] => 'Li Li',
      ['Lt.-Morales'] => 'Lt. Morales',
      ['Lucio'] => 'Lúcio',
      ['Sgt.-Hammer'] => 'Sgt. Hammer',
      ['TheLostVikings', 'Lost Vikings'] => 'The Lost Vikings',
      ['Zul\'Jin'] => 'Zul\'jin',
      ['junkrat'] => 'Junkrat',
      ['gazlowe'] => 'Gazlowe',
      ['genji'] => 'Genji',
      ['guldan'] => 'Gul\'dan',
      ['zarya'] => 'Zarya',
    }

    attr_accessor :browser
    def initialize(browser)
      @browser = browser
    end

    def heroes
      values.keys
    end

    def [](key)
      values[key]
    end

    def values
      @values ||= begin
        values = retrieve_values
        NAME_MAPPINGS.each do |wrong_names, name|
          wrong_names.each do |wrong_name|
            next unless values[wrong_name]
            values[name] = values.delete(wrong_name)
          end
        end
        values
      end
    end
  end
end