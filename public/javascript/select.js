document.addEventListener("DOMContentLoaded", () => {
    const examButtons = document.querySelectorAll(".exam-papers");
    const container = document.querySelector(".papers-container");

    setActiveButton('mid');
    loadPapers('mid');
    examButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const type = button.getAttribute('data-type');
            setActiveButton(type);
            loadPapers(type);
        });
    });

    async function loadPapers(type) {
        try {
            const response = await fetch(`/exam/${type}`);
            if (!response.ok) throw new Error('Failed to fetch exam papers');
            
            const html = await response.text();
            container.classList.add("opacity-0", "transition-opacity", "duration-300");
            setTimeout(() => {
                container.innerHTML = html;
                container.classList.remove("opacity-0");
            }, 300);
            
        } catch(err) {
            console.error('Error:', err);
            container.innerHTML = `
                <div class="p-4 bg-red-100 text-red-700 rounded transition-all duration-300">
                    Error loading exam papers. Please try again later.
                </div>
            `;
        }
    }

    function setActiveButton(activeType) {
        examButtons.forEach(button => {
            const buttonType = button.getAttribute('data-type');
            
            button.classList.add(
                "transition-all", 
                "duration-300", 
                "ease-in-out"
            );
            
            if (buttonType === activeType) {
                // Active state styles
                button.classList.add(
                    'bg-gradient-to-r', 
                    'from-blue-500', 
                    'to-purple-500', 
                    'text-white',
                    'shadow-lg'
                );
                button.classList.remove(
                    'border', 
                    'border-blue-200', 
                    'bg-white', 
                    'text-blue-700',
                    'shadow'
                );
            } else {
                button.classList.remove(
                    'bg-gradient-to-r', 
                    'from-blue-500', 
                    'to-purple-500', 
                    'text-white',
                    'shadow-lg'
                );
                button.classList.add(
                    'border', 
                    'border-blue-200', 
                    'bg-white', 
                    'text-blue-700',
                    'shadow'
                );
            }
        });
    }
});