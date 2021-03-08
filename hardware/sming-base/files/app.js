let sock;

const wsconnect = () => {
  sock = new WebSocket('ws://' + location.hostname + '/ws');
  // sock = new WebSocket('ws://192.168.2.91/ws');
  sock.onopen = () => {
    console.log('ws connected');
    $('#loading').detach();
  };
  /*
  recv msg types:
  {
    type: 0 //wifi scan result
    wifis: []
  }
  {
    type: 1 // save / probe result
    saved: true / false
    reason?: string
  }

  send msg type:
  {ssid, pw}
  */
  sock.onmessage = (event) => {
    const msg = JSON.parse(event.data);

    console.log('ws message');
    console.log(msg);


    if (msg.type === 0)
      updatewlist(msg.wifis);
    else if (msg.type === 1)
      saveresult(msg);

  };

  sock.onerror = (err) => {
    console.log('ws error: ');
    console.log(err);
  };

  sock.onclose = (event) => {
    console.log('ws closed: ');
    console.log(event);
    wsconnect();
  };
};

$('#save').on('click', () => {
  $('#save').append('<span class="spinner-border spinner-border-sm" role="status"></span>');
  $('#save').addClass('disabled');
  $('#save').attr('disabled', true);
  $('#pw').attr('disabled', true);
  const ssid = $('#ssid').text();
  const pw = $('#pw').val();

  const msg = {
    ssid: ssid,
    pw: pw
  };

  sock.send(JSON.stringify(msg));
});

const updatewlist = (wifilist) => {
  const oldssids = $('#list').children().toArray().map(b => b.dataset['ssid']);
  console.log(oldssids);
  const newssids = wifilist.filter(e => !oldssids.includes(e.ssid));
  console.log(newssids);
  newssids.forEach(el => {
    const nel = '<button type="button" class="list-group-item list-group-item-action" data-ssid="' + el.ssid + '" data-auth="' + el.auth + '">[' + el.auth + '] ' + el.ssid + '</button>';
    $('#list').append(nel);
  });

  $('#wload').remove();

  $('#list button').off('click');
  $('#list button').on('click', (e) => {
    e.preventDefault();
    $('#list button').removeClass('active');
    e.target.classList.add('active');
    $('#ssid').text(e.target.dataset['ssid']);
    $('#pwrow').remove();
    if (e.target.dataset['auth'] === 'OPEN') {
      $('#save').removeClass('disabled');
      $('#save').attr('disabled', false);
    } else {
      $('#save').attr('disabled', true);
      $('#save').addClass('disabled');
      $('#ssidrow').after('<div class="form-group row" id="pwrow"><label for="inputPassword" class="col-md-4 col-form-label">Password</label><div class="col-md-8"><input type="password" class="form-control" id="pw" placeholder="Password"></div></div>');
      $('#pw').on('keyup', () => {
        const l = $('#pw').val().length;
        if (l > 0) {
          $('#save').removeClass('disabled');
          $('#save').attr('disabled', false);
        } else {
          $('#save').addClass('disabled');
          $('#save').attr('disabled', true);
        }
      });
    }
    $('#selSSID').removeClass('invisible');
  });
};

const saveresult = (msg) => {
  const { saved, reason } = msg;
  if (saved) {
    alert('Config saved. Controller is rebooting.');
  } else {
    console.log(reason);
    $('#save').removeClass('disabled');
    $('#save').attr('disabled', false);
    $('#save span').remove();
    $('#pw').attr('disabled', false);
    alert('Connect failed: ' + reason);
  }
};

$(() => {
  wsconnect();
});

