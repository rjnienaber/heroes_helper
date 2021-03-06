module Sources
  module Common
    NAME_MAPPINGS = {
        ['Butcher', 'TheButcher'] => 'The Butcher',
        ['Anubarak'] => 'Anub\'arak',
        ['D.VA', 'Dva'] => 'D.Va',
        ['Deckard'] => 'Deckard Cain',
        ['ETC'] => 'E.T.C.',
        ['Gul\'Dan'] => 'Gul\'dan',
        ['gall'] => 'Gall',
        ['Li-Li'] => 'Li Li',
        ['Lt.-Morales'] => 'Lt. Morales',
        ['Lucio'] => 'Lúcio',
        ['mephisto'] => 'Mephisto',
        ['Sgt.-Hammer'] => 'Sgt. Hammer',
        ['Sgt.Hammer'] => 'Sgt. Hammer',
        ['TheLostVikings', 'Lost Vikings'] => 'The Lost Vikings',
        ['Zul\'Jin'] => 'Zul\'jin',
        ['junkrat'] => 'Junkrat',
        ['gazlowe'] => 'Gazlowe',
        ['genji'] => 'Genji',
        ['guldan'] => 'Gul\'dan',
        ['zarya'] => 'Zarya',
        ['YrelAvatar'] => 'Yrel',
        ['Malganis', 'malganis'] => 'Mal\'Ganis',
        ['Imperius2'] => 'Imperius'
    }

    private
    def normalize_values(raw_values)
      NAME_MAPPINGS.each do |wrong_names, name|
        wrong_names.each do |wrong_name|
          next unless raw_values[wrong_name]
          raw_values[name] = raw_values.delete(wrong_name)
        end
      end

      raw_values.keys.each do |hero|
        value = raw_values[hero]
        next unless value.is_a?(String)
        raw_values[hero] = value.gsub(' ', ' ')

      end

      raw_values
    end
  end
end