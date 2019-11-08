window.onload = () => {
  document.getElementById('logout').addEventListener('click',
    () => {
      confirm('Êtes-vous sûr de vouloir vous déconnecter?');
    });
};
