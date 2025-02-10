const userGrid = document.querySelector(".user-grid")
const userSearch = document.querySelector("#user")
const sortSelect = document.querySelector("#sort-select")
const searchBtn = document.querySelector("#search-btn")
const prevPageBtn = document.querySelector("#prev-page")
const nextPageBtn = document.querySelector("#next-page")
const pageInfo = document.querySelector("#page-info")

let users = []
let currentPage = 1
const usersPerPage = 12

const getUserData = async (page = 1) => {
  try {
    userGrid.innerHTML = '<div class="loading">Loading...</div>'
    const res = await fetch(`https://api.github.com/users?per_page=${usersPerPage}&page=${page}`)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const data = await res.json()
    users = data
    displayUsers(users)
    updatePagination()
  } catch (error) {
    console.error("Error:", error)
    userGrid.innerHTML = `<div class="error-message">Failed to load users. Please try again later.</div>`
  }
}

const displayUsers = (usersToDisplay) => {
  userGrid.innerHTML = ""
  usersToDisplay.forEach((user) => {
    const userCard = document.createElement("div")
    userCard.classList.add("user-card")
    userCard.innerHTML = `
            <img src="${user.avatar_url}" alt="${user.login}'s avatar">
            <div class="user-info">
                <h3>${user.login}</h3>
                <p>GitHub ID: ${user.id}</p>
                <div class="user-stats">
                    <span><i class="fas fa-users"></i> ${user.followers} followers</span>
                    <span><i class="fas fa-code-branch"></i> ${user.public_repos} repos</span>
                </div>
            </div>
            <a href="${user.html_url}" target="_blank" class="view-profile">View Profile</a>
        `
    userGrid.appendChild(userCard)
  })
}

const filterUsers = () => {
  const searchTerm = userSearch.value.toLowerCase()
  const filteredUsers = users.filter((user) => user.login.toLowerCase().includes(searchTerm))
  displayUsers(filteredUsers)
}

const sortUsers = () => {
  const sortBy = sortSelect.value
  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === "login") {
      return a.login.localeCompare(b.login)
    } else {
      return b[sortBy] - a[sortBy]
    }
  })
  displayUsers(sortedUsers)
}

const updatePagination = () => {
  pageInfo.textContent = `Page ${currentPage}`
  prevPageBtn.disabled = currentPage === 1
  nextPageBtn.disabled = users.length < usersPerPage
}

searchBtn.addEventListener("click", filterUsers)
sortSelect.addEventListener("change", sortUsers)

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--
    getUserData(currentPage)
  }
})

nextPageBtn.addEventListener("click", () => {
  currentPage++
  getUserData(currentPage)
})

// Initial load
getUserData()

