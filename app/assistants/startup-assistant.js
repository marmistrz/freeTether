function StartupAssistant(changelog)
{
	this.justChangelog = changelog;
	
    // on first start, this message is displayed, along with the current version message from below
    this.firstMessage = $L("freeTether is an application that allows you to share your phone's internet connection with other devices connected via USB, Bluetooth, or WiFi.");
	
    this.secondMessage = $L("If you find freeTether useful, please consider making a <a href=https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=2HVTWGXCB6C7N>donation</a> to support the developers");
	
    // on new version start
    this.newMessages =
	[
	{
      version: '1.2.0',
      log:
      [
      	'Backs up and hides Mobile Hotspot on install',
      	'Make freeTether\'s service persistent instead of dynamic',
        'Pre3 screen size fix',
        'Remove bt and usb interfaces from bridge when disabled',
        'Restore previous states when app is closed with out disabling first',
      ]
    },
	{
      version: '1.1.3',
      log:
      [
        'Add advanced usb prefs back, only visible if secret passphrase is typed',
      ]
    },
	{
      version: '1.1.2',
      log:
      [
        'Make sure custom TCP prefs are used on startup',
      ]
    },
	{
      version: '1.1.1',
      log:
      [
        'Added options to auto-tether interfaces on app startup',
      ]
    },
	{
      version: '1.1.0',
      log:
      [
        'Set "default" gateway/router IP to 192.168.100.1',
        'Add help overlay to all options',
        'Set font color TCP settings to crimson if invalid',
        'Disable main toggles if there are invalid TCP settings',
        'Turn "DHCP Server" text crimson if there are invalid TCP settings'
      ]
    },
	{
      version: '1.0.0',
      log:
      [
        'Move out of testing feed.'
      ]
    },
	{
      version: '0.99.15',
      log:
      [
        'Fix TCP cookie bug.'
      ]
    },
	{
      version: '0.99.14',
      log:
      [
        'Fix cookie bug... saving settings works properly'
      ]
    },
    {
      version: '0.99.13',
      log:
      [
        'Disable settings while interface active',
        'Add TCP/IP Preferences'
      ]
    },
    {
      version: '0.99.12',
      log:
      [
        'Defaul to Open for WiFi Tethering',
        'Styling tweaks',
        'Show passphrase hint',
        'Menu options for each interface', 
      ]
    },
    {
      version: '0.99.11',
      log:
      [
        'Add client info scene',
        'End freeTether service on app close'
      ]
    },
    {
      version: '0.99.10',
      log:
      [
        'Default to WPA for WiFi Tethering',
        'Provide default passphrase',
        'Enforce min passphrase length',
        'Random passphrase generator'
      ]
    },
    {
      version: '0.99.9',
      log:
      [
        'Service fixes for race conditions and client list reporting',
        'Save and restore interface state',
        'Fix spinner states and multi-interface toggling',
        'Fix client list to correctly update hostnames'
      ]
    },
    {
      version: '0.99.7',
      log:
      [
        'Bluetooth PAN Profile'
      ]
    },
		{
			version: '0.99.6',
			log:
			[
				'USB, Bluetooth and WiFi support',
				'1.4.5 and 2.x.x support',
				'Improved UI'
			]
		},
	];
	
	// random continue button message
	this.randomContinue = 
	[
		{weight: 30, text: $L("Ok, I've read this. Let's continue ...")},
		{weight:  5, text: $L("Yeah, Yeah, Whatever ...")}
	];
	
    // setup menu
    this.menuModel =
	{
	    visible: true,
	    items:
	    [
			{
				label: "Help",
				command: 'do-help'
			}
	     ]
	};
	
    // setup command menu
    this.cmdMenuModel =
	{
	    visible: false, 
	    items:
	    [
		    {},
		    {
				label: this.getRandomContinueMessage(),
				command: 'do-continue'
		    },
		    {}
	     ]
	};
};

StartupAssistant.prototype.setup = function()
{
	 this.controller.document.body.className = 'palm-dark';
	
    // get elements
    this.titleContainer = this.controller.get('title');
    this.dataContainer =  this.controller.get('data');
	
    // set title
	if (this.justChangelog)
	{
		this.titleContainer.innerHTML = $L('Changelog');
	}
	else
		{
	    if (vers.isFirst) 
		{
		    this.titleContainer.innerHTML = $L("Welcome To freeTether");
		}
	    else if (vers.isNew) 
		{
		    this.titleContainer.innerHTML = $L("freeTether Changelog");
		}
	}
	
	
    // build data
    var html = '';
	if (this.justChangelog)
	{
		for (var m = 0; m < this.newMessages.length; m++) 
		{
		    html += Mojo.View.render({object: {title: 'v' + this.newMessages[m].version}, template: 'startup/changeLog'});
		    html += '<ul>';
		    for (var l = 0; l < this.newMessages[m].log.length; l++)
			{
				html += '<li>' + this.newMessages[m].log[l] + '</li>';
		    }
		    html += '</ul>';
		}
	}
	else
	{
		if (vers.isFirst)
		{
			html += '<div class="text">' + this.firstMessage + '</div>';
		}
	    if (vers.isNew)
		{
			if (!this.justChangelog)
			{
				html += '<div class="text">' + this.secondMessage + '</div>';
			}
			for (var m = 0; m < this.newMessages.length; m++) 
			{
			    html += Mojo.View.render({object: {title: 'v' + this.newMessages[m].version}, template: 'startup/changeLog'});
			    html += '<ul>';
			    for (var l = 0; l < this.newMessages[m].log.length; l++)
				{
					html += '<li>' + this.newMessages[m].log[l] + '</li>';
			    }
			    html += '</ul>';
			}
	    }
	}
	
    // set data
    this.dataContainer.innerHTML = html;
	
	
    // setup menu
    this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, this.menuModel);
	
	if (!this.justChangelog)
	{
	    // set command menu
	    this.controller.setupWidget(Mojo.Menu.commandMenu, { menuClass: 'no-fade' }, this.cmdMenuModel);
	}
	
    // set this scene's default transition
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade);
};

StartupAssistant.prototype.getRandomContinueMessage = function()
{
	// loop to get total weight value
	var weight = 0;
	for (var r = 0; r < this.randomContinue.length; r++)
	{
		weight += this.randomContinue[r].weight;
	}
	
	// random weighted value
	var rand = Math.floor(Math.random() * weight);
	
	// loop through to find the random title
	for (var r = 0; r < this.randomContinue.length; r++)
	{
		if (rand <= this.randomContinue[r].weight)
		{
			return this.randomContinue[r].text;
		}
		else
		{
			rand -= this.randomContinue[r].weight;
		}
	}
	
	// if no random title was found (for whatever reason, wtf?) return first and best subtitle
	return this.randomContinue[0].text;
}

StartupAssistant.prototype.activate = function(event)
{
    // start continue button timer
    this.timer = this.controller.window.setTimeout(this.showContinue.bind(this), 5 * 1000);
};
StartupAssistant.prototype.showContinue = function()
{
    // show the command menu
    this.controller.setMenuVisible(Mojo.Menu.commandMenu, true);
};
StartupAssistant.prototype.handleCommand = function(event)
{
    if (event.type == Mojo.Event.command)
	{
	    switch (event.command)
		{
			case 'do-continue':
				this.controller.stageController.swapScene({name: 'main', transition: Mojo.Transition.crossFade});			
				break;
								
			case 'do-help':
				this.controller.stageController.pushScene('help');
				break;		
		}
	}
};

