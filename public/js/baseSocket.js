const baseSocket = io(`?username=${username}`);

baseSocket.on('invite',
  (invitation) => {
    $('#sender').text(invitation.sender);
    $('#namespace-text').text(invitation.namespace);
    $('#namespace-link').attr('href',
      `/game/${invitation.namespace}`);
    $('#invitationModal').modal('show');
  });
