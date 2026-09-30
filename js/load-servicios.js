document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("servicios-container");
  
  if (!container) return;

  fetch('js/servicios.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao carregar o arquivo de serviços.');
      }
      return response.json();
    })
    .then(servicios => {
      container.innerHTML = '';
      
      servicios.forEach(servico => {
        // Monta as tags técnicas de forma dinâmica
        let tagsHTML = '';
        if (servico.tags && Array.isArray(servico.tags)) {
          tagsHTML = '<div class="tag-group" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 15px;">';
          servico.tags.forEach(tag => {
            tagsHTML += `<span class="tag" style="background: var(--bg-subtle, #FFFBEB); color: var(--text-primary, #060913); font-size: 0.75rem; font-weight: 600; padding: 4px 10px; border-radius: 6px; border: 1px solid var(--border-gold, rgba(241, 228, 6, 0.3));">${tag}</span>`;
          });
          tagsHTML += '</div>';
        }

        const cardHTML = `
          <a href="${servico.slug}" class="service-card-dynamic" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; justify-content: space-between; background: var(--bg-surface, #FFFEFA); border: 1px solid var(--border-light, #E5E7EB); border-radius: 12px; padding: 30px; box-shadow: var(--shadow-hover); transition: var(--transition-smooth, all 0.4s cubic-bezier(0.16, 1, 0.3, 1));">
            <div>
              <div class="service-header" style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                <div class="service-icon" style="color: var(--brand-yellow, #f1e406); display: flex; align-items: center; justify-content: center;">
                  ${servico.icone}
                </div>
                <h3 style="color: var(--text-primary, #060913); font-size: 1.25rem; margin: 0;">${servico.titulo}</h3>
              </div>
              <p style="color: var(--text-secondary, #374151); font-size: 0.95rem; line-height: 1.5; margin: 0 0 20px 0;">${servico.descricao}</p>
            </div>
            ${tagsHTML}
          </a>
        `;
        container.innerHTML += cardHTML;
      });

      // Adiciona o efeito dinâmico de hover com borda amarela via JS para garantir o efeito suave
      const cards = container.querySelectorAll('.service-card-dynamic');
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          card.style.borderColor = 'var(--brand-yellow, #f1e406)';
          card.style.transform = 'translateY(-4px)';
          card.style.boxShadow = 'var(--shadow-premium)';
        });
        card.addEventListener('mouseleave', () => {
          card.style.borderColor = 'var(--border-light, #E5E7EB)';
          card.style.transform = 'translateY(0)';
          card.style.boxShadow = 'var(--shadow-hover)';
        });
      });

    })
    .catch(error => {
      console.error('Erro:', error);
      container.innerHTML = '<p style="color: var(--color-error);">No foi possível carregar os serviços no momento.</p>';
    });
});