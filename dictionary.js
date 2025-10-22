// Create references to elements in the DOM
const input = document.getElementById("input");
const definition = document.getElementById("definition");
const form = document.getElementById("form");
const audio = document.getElementById("audio");

// Create listener for form submission
form.addEventListener("submit", function(event) {
  // Prevent page reload
  event.preventDefault();

  // Get the word from input and return if empty
  const word = input.value.trim();
  if (word === "") return;

  // Grab data
  fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word)
    .then(function(response) {
      // Check for valid response
      if (!response.ok) throw new Error("Invalid word entered");
      return response.json();
    })
    .then(function(data) {
      const entry = data[0];

      // Create definitions
      let definitionOfWord = "";
      entry.meanings.forEach(function(meaning) {
        definitionOfWord += "<h2>" + meaning.partOfSpeech + "</h2>";
        definitionOfWord += "<ul>";
        meaning.definitions.forEach(function(def) {
          let synonymsOfWord = "";
          if (def.synonyms.length > 0) {
            synonymsOfWord = " (Synonyms: " + def.synonyms.join(", ") + ")";
          }
          definitionOfWord += "<li>" + def.definition + synonymsOfWord + "</li>";
        });
        definitionOfWord += "</ul>";
      });
      definition.innerHTML = definitionOfWord;

      // Check for audio and play if available
      let audioFound = false;
      entry.phonetics.forEach(function(sound) {
        if (sound.audio) {
          audio.src = sound.audio;
          audio.style.display = "grid";
          audioFound = true;
        }
      });
      if (!audioFound) {
        audio.style.display = "none";
      }
    })
    .catch(function(error) {
      definition.textContent = "Error: " + error.message;
      audio.style.display = "none";
    });
});
