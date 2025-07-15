// Mobile menu toggle
function toggleMenu() {
  const menu = document.querySelector('.menu-links');
  const icon = document.querySelector('.hamburger-icon');
  menu.classList.toggle('open');
  icon.classList.toggle('open');
}

// GitHub projects loader
document.addEventListener('DOMContentLoaded', function () {
  const projectsContainer = document.getElementById('projects-container');
  const username = 'theekshana-thennakoon'; // Your GitHub username

  // Fetch repositories from GitHub API
  fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }
      return response.json();
    })
    .then(repositories => {
      projectsContainer.innerHTML = ''; // Clear loading message

      // Filter out unwanted repositories
      const filteredRepos = repositories.filter(repo => {
        // Skip forks
        if (repo.fork) return false;

        const repoName = repo.name.toLowerCase();

        // Skip the github.io repository (with different possible separators)
        const githubIoPatterns = [
          `${username.toLowerCase()}.github.io`,
          `${username.toLowerCase().replace('-', '_')}.github.io`,
          'theekshanathennakoon.github.io'
        ];

        if (githubIoPatterns.some(pattern => repoName === pattern)) {
          return false;
        }

        // Skip repositories with name "Election System" (case insensitive)
        // but keep "Online Election System"
        if (repoName.includes('election system') && !repoName.includes('online election system')) {
          return false;
        }

        return true;
      });

      // Group repositories into chunks of 3 for layout
      for (let i = 0; i < filteredRepos.length; i += 3) {
        const repoGroup = filteredRepos.slice(i, i + 3);

        // Create a container for each group of 3 projects
        const groupContainer = document.createElement('div');
        groupContainer.className = 'about-containers';

        // Add each project to the group
        repoGroup.forEach(repo => {
          const projectCard = document.createElement('div');
          projectCard.className = 'details-container color-container';

          // Format the project name (replace hyphens and underscores with spaces and capitalize)
          let projectName = repo.name
            .replace(/[-_]/g, ' ') // Replace both - and _ with spaces
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          projectCard.innerHTML = `
            <h2 class="experience-sub-title project-title">${projectName}</h2>
            <div class="project-meta">
              <span class="project-language">${repo.language || 'Various'}</span>
              <span class="project-updated">${new Date(repo.updated_at).toLocaleDateString()}</span>
            </div>
            <div class="btn-container">
              <button class="btn btn-color-2 project-btn link-btn" onclick="window.open('${repo.html_url}', '_blank')">
                View on GitHub
              </button>
              ${repo.homepage ? `
              <button class="btn btn-color-1 project-btn link-btn" onclick="window.open('${repo.homepage}', '_blank')">
                Live Demo
              </button>` : ''}
            </div>
          `;

          groupContainer.appendChild(projectCard);
        });

        projectsContainer.appendChild(groupContainer);
      }

      // If no repositories were found
      if (filteredRepos.length === 0) {
        projectsContainer.innerHTML = `
          <div class="no-projects-message">
            No public repositories found. Check back later or visit my 
            <a href="https://github.com/${username}" target="_blank">GitHub profile</a>.
          </div>
        `;
      }
    })
    .catch(error => {
      console.error('Error fetching GitHub repositories:', error);
      projectsContainer.innerHTML = `
        <div class="error-message">
        <p class="error-detail" style = 'color:red;'> Network Connection Error</p>
          Could not load projects from GitHub. Please visit my 
          <a href="https://github.com/${username}" target="_blank">GitHub profile</a> directly.
        </div>
      `;
    });
});