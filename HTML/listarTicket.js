/*---
Función para procesar los parámetros recibidos en el URL
*/
function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

console.log("Comienza listarTicket.js");

var query = getQueryParams(document.location.search);
console.log("id:", query.id);
console.log("nombre:", query.nombre);
console.log("contacto:", query.contacto);
console.log("ultima_fecha:", query.fecha_ultimo_ingreso);
console.log("mode:", query.mode);

// Mostrar datos del usuario en formato tabla (como en la imagen)
const nombreMostrar = query.nombre || query.id;
const fechaFormateada = new Date(query.fecha_ultimo_ingreso).toLocaleDateString();

document.getElementById("lastlogin").innerHTML = `
  <table style="border-collapse: collapse; text-align: left; font-size: 16px;">
    <tr><td><strong>Cliente</strong></td><td>${query.id}</td></tr>
    <tr><td><strong>Contacto</strong></td><td>${query.contacto}</td></tr>
    <tr><td><strong>Nombre</strong></td><td>${nombreMostrar}</td></tr>
    <tr><td><strong>Último ingreso</strong></td><td>${fechaFormateada}</td></tr>
  </table>
`;

const systemURL = { 
    listarTicket: "http://127.0.0.1:5500/HTML/listarTicket.html",
    loginCliente: "http://127.0.0.1:5500/HTML/loginClient.html",
};

const RESTAPI = {
    loginCliente: "http://127.0.0.1:8080/api/loginCliente",
    listarTicket: "http://localhost:8080/api/listarTicket",
};

const HTMLResponse = document.querySelector("#app");
var ticket = {
    "ID": query.id,
};
    
var options = {
    method: 'GET',
};
var APIREST_URL = '';
console.log('transferred mode:', query.mode);    

switch (query.mode) {
  case "LOCAL":
    console.log("Utiliza servidor NodeJS local.");
    console.log("API_listarTicket:", RESTAPI.listarTicket); 
  
    ticket = {
       "clienteID": query.id, // ← Nota: la API espera "clienteID"
    };
    
    options = {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(ticket),
    };
    console.log("ticket:", JSON.stringify(ticket), "options:", JSON.stringify(options));

    APIREST_URL = RESTAPI.listarTicket;
    break;
  case "TYPICODE":
    console.log("Typicode no soportado en ésta función");
    APIREST_URL = 'https://my-json-server.typicode.com/lu7did/mesaayuda/posts/' + query.id;
    break;
  case "AWS":
    console.log("Utiliza AWS como serverless");
    APIREST_URL = 'https://n3ttz410ze.execute-api.us-east-1.amazonaws.com/default/listTicketGET?ID=' + query.id;
    break;
  default:
    console.log("Asume AWS.");
    APIREST_URL = 'https://n3ttz410ze.execute-api.us-east-1.amazonaws.com/default/listTicketGET?ID=' + query.id;
}

console.log("APIREST_URL:", APIREST_URL);
console.log("ticket:", JSON.stringify(ticket));
console.log("options:", JSON.stringify(options));

fetch(APIREST_URL, options)
  .then(res => res.json())
  .then(ticket => {
    console.log("ticket:", ticket);
    let f = false;
    let table = document.createElement("table");
    table.style.border = "1px solid";
    table.style.backgroundColor = "#f0f0f0";

    if (ticket.data && Array.isArray(ticket.data)) {
      ticket.data.forEach((t) => { 
        if (t.clienteID == query.id) {
          if (!f) {
            f = true;
            const hdr = ["ID Ticket", "Descripción", "Estado", "Solución", "Fecha"];
            let tr = document.createElement("tr");
            tr.style.border = "1px solid";
            hdr.forEach((item) => {
              let th = document.createElement("th");
              th.style.border = "1px solid";
              th.innerText = item;
              tr.appendChild(th);
            });
            table.appendChild(tr);                   
          }

          const estado = t.estado_solucion === 1 ? 'Pendiente' : 'Resuelto';
          const body = [t.id, t.descripcion, estado, t.solucion || 'Sin solución', t.ultimo_contacto];
          
          let trl = document.createElement("tr");
          body.forEach((line) => {
            let td = document.createElement("td");
            td.style.border = "1px solid";
            td.innerText = line;
            trl.appendChild(td);
          });
          table.appendChild(trl);                   
        }
      });
    }

    if (f) {
      HTMLResponse.appendChild(table);
    } else {
      console.log("no tiene tickets");
      const mensajes = document.getElementById('mensajes');
      mensajes.style.textAlign = "center";
      mensajes.style.color = "RED";
      mensajes.innerHTML = "No hay tickets pendientes";
    }
  })
  .catch(error => {
    console.error("Error al cargar tickets:", error);
    document.getElementById('mensajes').innerHTML = "Error al conectar con el servidor.";
  });