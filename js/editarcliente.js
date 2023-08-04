(function(){
    let DB;
    let idCliente;

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formularo = document.querySelector('#formulario');
 
    document.addEventListener('DOMContentLoaded', () => {
        abirDB();

        formulario.addEventListener('submit', actualizarCliente);
    })
 
    function abirDB(){
        const abirDB = window.indexedDB.open('crm', 1);
 
        abirDB.onerror = () => {
            console.log('Hubo un error al abrir la BD');
        }
 
        abirDB.onsuccess = () => {
            DB = abirDB.result;
            obtenerParametros(); // llamando la funcion aqui, no se presenta el error de undefined
        }
    }
 
    function obtenerParametros(){
        const params = new URLSearchParams(window.location.search)
        idCliente = params.get('id');
        obtenerCliente(idCliente);
    }
 
    function obtenerCliente(id){
        const transaction = DB.transaction('crm', 'readonly');
        const objectStore = transaction.objectStore('crm');
        const request = objectStore.openCursor();
 
        request.onsuccess = e => {
            const cursor = e.target.result;
            if(cursor){
                if(cursor.value.id == id){
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        }
    }
 
    function llenarFormulario(datosCliente){
        const {nombre, email, telefono, empresa} = datosCliente;
        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
        formulario.querySelector('[type="submit"]').value = 'Guardar cambios';
    }

    function actualizarCliente(e) {
        e.preventDefault();
        
        if(nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return
        }

        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)
        }

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteActualizado);

        transaction.oncomplete = function() {
            imprimirAlerta('Editado correctamente');

            setTimeout(() => {
                window.location.href = "index.html";
            }, 3000);
        }
        
        transaction.onerror = function() {
            imprimirAlerta('Hubo un error', 'error');
        }
    }

})();