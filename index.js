document.addEventListener('DOMContentLoaded', () => {

    //Referencias al DOM
    const cards = document.querySelector('.cards');
    const callButton = document.querySelector('#llamado');
    const deleteHTML = document.querySelector('#borrarLlamado');
    const nombreInput = document.querySelector('.formulario--input #nombre');
    const personajeInput = document.querySelector('#personajeInput');

    callButton.disabled = true;

    //listeners 
    cargarListeners();

    function cargarListeners() {

        deleteHTML.addEventListener('click', () => {
            limpiarHTML();
        });

        nombreInput.addEventListener('blur', validarFormulario);

        personajeInput.addEventListener('blur', (e) => {
            callButton.disabled = false; 
            console.log(e.target.value);   
            llamarPersonajes(e.target.value); 
        });
    };

    //Peticion a la API
    const llamarPersonajes = async (name) => {

        //Limpiamos el HTML en caso de que el usuario haya consultado un personaje antes
        limpiarHTML();

        //Llamada a la API utilizando async/await. Extraemos la data y de ahi extraemos los results (los obj con los personajes) y renombramos la variable
        const { data: { results: personajes } } = await axios.get(`https://rickandmortyapi.com/api/character/?name=${name}`);
        crearCard(personajes);
    };

    //Rellena las opciones por defecto del input select
    const cargarPersonajesForm = async () => {
        const { data: { results } } = await axios.get(`https://rickandmortyapi.com/api/character`);

        results.forEach(character => {
            const { name } = character;
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            personajeInput.appendChild(option);
        });
    };

    cargarPersonajesForm();


    //Mostrar resultados en el HTML
    function crearCard(personajes) {

        //Asignacion de peropiedades por cada personaje
        personajes.map(personaje => {

            const { location: { name: planeta }, episode } = personaje;


            /*
                TODO: Guardar el personaje en localStorage y mostrarlo si el usuario recarga la pagina
            */
           
            const savePersonaje = JSON.stringify(personaje);
            localStorage.setItem('personaje', JSON.stringify(savePersonaje));

            //crear el contenedor padre card
            const card = document.createElement('div');
            card.classList.add('card');

            //Crear el contenedor de informacion del personaje
            const info = document.createElement('div');
            info.classList.add('info');


            //Creando y asignando la info de cada personaje
            info.innerHTML = `
                <img src="${personaje.image}" alt="${personaje.name}" />
                <h2>${personaje.name}</h2>
                <p>${personaje.status}</p>
                <p>Specie: ${personaje.species}</p>
                <p>Lives in: ${planeta}</p>
                <p>Have been in ${episode.length} episodes</p>
            `;


            //Agregar los nodos al padre
            card.appendChild(info);
            cards.appendChild(card);

        });
    };

    function limpiarHTML() {
        cards.innerHTML = '';
    };

    function validarFormulario(e) {

        if (e.target.value.length > 0) {
            let name = e.target.value;
            name = name.toLowerCase();
            e.target.classList.remove('validado-red');
            e.target.classList.add('validado-green');
            callButton.disabled = false;

            callButton.addEventListener('click', () => {
                llamarPersonajes(name);
            });

        } else {
            e.target.classList.remove('validado-green');
            e.target.classList.add('validado-red');
        };
    };
});