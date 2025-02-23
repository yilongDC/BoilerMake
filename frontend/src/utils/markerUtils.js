export const getRandomFigure = () => {
    const figures = ['Figure1.svg', 'Figure2.svg', 'Figure3.svg', 'Figure4.svg'];
    const randomIndex = Math.floor(Math.random() * figures.length);
    return figures[randomIndex];
};

export function createMarkerContent(property) {
    const content = document.createElement("div");
    content.className = "marker-content";
    content.innerHTML = `
        <div class="property bg-white rounded-lg shadow-lg p-2 cursor-pointer transform transition-transform hover:scale-105">
            <div class="font-bold text-lg">${property.id}</div>
            <div class="text-sm">${property.description}</div>
            <div class="text-xs text-gray-500">${property.address}</div>
        </div>
    `;
    return content;
}
