const baseSocket = io(`http://localhost:5060?username=${username}`);

baseSocket.on('invite',
  () => {
    console.log('invited');
  });
