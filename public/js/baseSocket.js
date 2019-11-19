const baseSocket = io(`http://localhost:5060?username=${username}`);

baseSocket.on('invite',
  (invitation) => {
    $('#sender').text(invitation.sender);
    $('#namespace-text').text(invitation.namespace);
    $('#namespace-link').attr('href',
      `/game/${invitation.namespace}`);
    $('#invitationModal').modal('show');
  });
