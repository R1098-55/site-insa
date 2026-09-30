document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("servicios-container");
  
  if (!container) return;

  fetch('js/servicios.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al cargar el archivo de servicios.');
      }
      return response.json();
    })
    .then(servicios => {
      container.innerHTML = '';
      
      // Utiliza un DocumentFragment para mejorar el rendimiento y evitar múltiples reflows
      const fragmento = document.createDocumentFragment();

      servicios.forEach(servicio => {
        // Monta las etiquetas técnicas de forma dinámica
        let tagsHTML = '';
        if (servicio.tags && Array.isArray(servicio.tags)) {
          tagsHTML = '<div class="tag-group" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 15px;">';
          servicio.tags.forEach(tag => {
            tagsHTML += `<span class="tag" style="background: var(--bg-subtle, #FFFBEB); color: var(--text-primary, #060913); font-size: 0.75rem; font-weight: 600; padding: 4px 10px; border-radius: 6px; border: 1px solid var(--border-gold, rgba(241, 228, 6, 0.3));">${tag}</span>`;
          });
          tagsHTML += '</div>';
        }

        const elementoTarjeta = document.createElement('a');
        elementoTarjeta.href = servicio.slug;
        elementoTarjeta.className = 'service-card-dynamic';
        elementoTarjeta.style.cssText = `
          text-decoration: none; 
          color: inherit; 
          display: flex; 
          flex-direction: column; 
          justify-content: space-between; 
          background: var(--bg-surface, #FFFEFA); 
          border: 1px solid var(--border-light, #E5E7EB); 
          border-radius: 12px; 
          padding: 30px; 
          box-shadow: var(--shadow-hover); 
          transition: var(--transition-smooth, all 0.4s cubic-bezier(0.16, 1, 0.3, 1));
        `;

        elementoTarjeta.innerHTML = `
          <div>
            <div class="service-header" style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
              <div class="service-icon" style="color: var(--brand-yellow, #f1e406); display: flex; align-items: center; justify-content: center;">
                ${servicio.icone}
              </div>
              <h3 style="color: var(--text-primary, #060913); font-size: 1.25rem; margin: 0;">${servicio.titulo}</h3>
            </div>
            <p style="color: var(--text-secondary, #374151); font-size: 0.95rem; line-height: 1.5; margin: 0 0 20px 0;">${servicio.descricao}</p>
          </div>
          ${tagsHTML}
        `;

        // Añade el efecto dinámico de hover directamente mediante JS
        elementoTarjeta.addEventListener('mouseenter', () => {
          elementoTarjeta.style.borderColor = 'var(--brand-yellow, #f1e406)';
          elementoTarjeta.style.transform = 'translateY(-4px)';
          elementoTarjeta.style.boxShadow = 'var(--shadow-premium)';
        });
        
        elementoTarjeta.addEventListener('mouseleave', () => {
          elementoTarjeta.style.borderColor = 'var(--border-light, #E5E7EB)';
          elementoTarjeta.style.transform = 'translateY(0)';
          elementoTarjeta.style.boxShadow = 'var(--shadow-hover)';
        });

        fragmento.appendChild(elementoTarjeta);
      });

      container.appendChild(fragmento);
    })
    .catch(error => {
      console.error('Error:', error);
      container.innerHTML = '<p style="color: var(--color-error);">No ha sido posible cargar los servicios en este momento.</p>';
    });
});