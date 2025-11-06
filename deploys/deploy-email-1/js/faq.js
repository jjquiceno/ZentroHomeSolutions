document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-deploy-list .deploy-item');
    
    faqItems.forEach(item => {
        const toggle = item.querySelector('.deploy-item-toggle');
        const content = item.querySelector('.deploy-item-content');
        const icon = item.querySelector('.deploy-item-icon i');
        
        if (toggle && content) {
            toggle.addEventListener('click', () => {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherContent = otherItem.querySelector('.deploy-item-content');
                        const otherIcon = otherItem.querySelector('.deploy-item-icon i');
                        if (otherContent) otherContent.classList.remove('active');
                        if (otherIcon) {
                            otherIcon.classList.remove('up');
                        }
                    }
                });

                const isActive = content.classList.toggle('active');
                
                if (icon) {
                    if (isActive) {
                        icon.classList.add('up');
                    } else {
                        icon.classList.remove('up');
                    }
                }
            });
        }
    });
});
