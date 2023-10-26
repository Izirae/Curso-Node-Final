async function getUsers() {
  let tbody = document.getElementById("tbody")

  await axios.get(`/api/users/profile`, {

  })
    .then(response => {
      response.data.forEach((e, i = 0) => {
        i++
        const html = `
                        <td class="py-5">${i}</td>
                        <td class="py-5">${e.first_name}</td>
                        <td class="py-5">${e.email}</td>
                        <td class="py-5">${e.role}</td>
                        <td class="py-5"><div class="btn-group">
                              <button type="button" class="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                Action
                              </button>
                              <ul class="dropdown-menu dropdown-menu-dark">
                                <li><button id=${e._id} class="dropdown-item" onclick="upgradeUser(this.id)">Cambio de Rol</button></li>
                                <li><button id=${e._id} class="dropdown-item" onclick="deleteUser(this.id)">Eliminar</button></li>
                              </ul>
                            </div>
                        </td>
                      `
        const tr = document.createElement('tr');
        tr.id = e._id;
        tr.innerHTML = html;
        tbody.appendChild(tr);
      })

    })
    .catch(error => {
      console.log(error)
    })


}
async function deleteUser(id) {
  console.log("esto", id)
  await axios.post(`/api/users/deleteUser/${id}`, {})
    .then(response => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        toast: true,
        title: 'Usuario Eliminado Correctamente',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1500
      })
      setTimeout(() => window.location.reload(), 1500)
    })
    .catch(error => {
      console.log(error)
      Swal.fire({
        position: 'center',
        icon: 'error',
        toast: true,
        title: `${eresponse.response.data.message}`,
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1500
      })
    })
}

async function upgradeUser(id) {
  await axios.post(`/api/users/premium/${id}`, {})
    .then(result => {
      Swal.fire({
        icon: 'success',
        title: `${result.data.message}`,
        toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      setTimeout(() => window.location.reload(), 1500)
    }).catch(error => {
      Swal.fire({
        position: 'center',
        icon: 'error',
        toast: true,
        title: `${error.response.data.message}`,
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 3000
      })
    })
}

getUsers()