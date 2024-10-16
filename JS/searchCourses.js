function searchCourses() {
    // Haal de zoekterm op uit het zoekveld
    let searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();

    // Haal alle courseListItems op
    let courses = document.querySelectorAll('.courseListItem');

    // Loop door elke courseListItem en check of deze overeenkomt met de zoekterm
    courses.forEach(course => {
        let courseName = course.querySelector('.courseName').textContent.toLowerCase();
        let courseLocation = course.querySelector('.courseLocation').textContent.toLowerCase();
        let roundInfo = course.querySelector('.roundInfo').textContent.toLowerCase();

        // Check of de zoekterm overeenkomt met een van de velden
        if (courseName.includes(searchTerm) || courseLocation.includes(searchTerm) || roundInfo.includes(searchTerm)) {
            course.style.display = "flex";  // Gebruik "flex" om de originele weergave te behouden
        } else {
            course.style.display = "none";  // Verberg als de zoekterm niet overeenkomt
        }
    });
}
