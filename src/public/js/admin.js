async function getUsers() {
  let tbody = document.getElementById("tbody")

  await axios.get(`/api/users/profile`, {

  })
    .then(response => {
      response.data.forEach((e, i = 0) => {
        i++
        const html = `
                        <td class="text-center py-4">${i}</td>
                        <td class="text-center py-4">${e.first_name}</td>
                        <td class="text-center py-4">${e.email}</td>
                        <td class="text-center py-4">${e.role}</td>
                        <td class="text-center py-4"><div class="btn-group">
                              <button type="button" class="btn btn-warning dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                Action
                              </button>
                              <ul class="dropdown-menu dropdown-menu-dark">
                                <li><button id=${e._id} class="dropdown-item" onclick="upgradeUser(this.id)">Upgrade rol</button></li>
                                <li><button id=${e._id} class="dropdown-item" onclick="deleteUser(this.id)">Delete</button></li>
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
  await axios.post(`/api/users/deleteUser/${id}`, {})
    .then(response => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Usuario eliminado correctamente',
        showConfirmButton: false,
        timer: 1500
      })
      setTimeout(() => window.location.reload(), 1500)
    })
    .catch(error => {
      console.log(error)
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: `${response.message}`,
        showConfirmButton: false,
        timer: 1500
      })
    })
}

async function upgradeUser(id) {
  await axios.post(`/api/users/premium/${id}`, {})
    .then(result => {
      if (result.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Se ha modificado el rol del usuario',
          toast: true,
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        setTimeout(() => window.location.reload(), 1500)
      }
      else {
        Swal.fire({
          icon: 'error',
          title: `No se pudo modificar el rol del usuario (al usuario le falta documentación)`,
          toast: true,
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    })
}

getUsers()