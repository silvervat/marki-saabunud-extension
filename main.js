// Märgi saabunud extension - Trimble Connect 3D Workspace API näide

// Kontrolli, kas kõik valitud detailid on juba "saabunud"
async function allSelectedAreReceived(selection) {
  for (const object of selection) {
    const props = await window.TrimbleConnectWorkspace.getObjectProperties(object.id);
    if (!props || props["Staatus"] !== "saabunud") {
      return false;
    }
  }
  return true;
}

// Märgi kõik valitud detailid "saabunuks"
async function markSelectedAsReceived(selection) {
  for (const object of selection) {
    let props = await window.TrimbleConnectWorkspace.getObjectProperties(object.id);
    if (!props) props = {};
    props["Staatus"] = "saabunud";
    await window.TrimbleConnectWorkspace.setObjectProperties(object.id, props);
  }
}

// Kontrolli, kas kõik valitud detailid on juba "kontrollitud"
async function allSelectedAreChecked(selection) {
  for (const object of selection) {
    const props = await window.TrimbleConnectWorkspace.getObjectProperties(object.id);
    if (!props || props["Staatus"] !== "kontrollitud") {
      return false;
    }
  }
  return true;
}

// Märgi kõik valitud detailid "kontrollituks"
async function markSelectedAsChecked(selection) {
  for (const object of selection) {
    let props = await window.TrimbleConnectWorkspace.getObjectProperties(object.id);
    if (!props) props = {};
    props["Staatus"] = "kontrollitud";
    await window.TrimbleConnectWorkspace.setObjectProperties(object.id, props);
  }
}

window.addEventListener('load', function() {
  window.TrimbleConnectWorkspace.on('selectionChanged', async function(selection) {
    const hasSelection = selection && selection.length > 0;

    // Märgi saabunud nupp
    if (hasSelection) {
      const alreadyReceived = await allSelectedAreReceived(selection);
      if (alreadyReceived) {
        window.TrimbleConnectWorkspace.setMenuButtonTitle('mark-received', 'saabunud');
        window.TrimbleConnectWorkspace.setMenuButtonEnabled('mark-received', false);
      } else {
        window.TrimbleConnectWorkspace.setMenuButtonTitle('mark-received', 'MÄRGI SAABUNUD');
        window.TrimbleConnectWorkspace.setMenuButtonEnabled('mark-received', true);
      }
      window.TrimbleConnectWorkspace.setMenuButtonVisible('mark-received', true);

      // Märgi kontrollituks nupp
      const alreadyChecked = await allSelectedAreChecked(selection);
      if (alreadyChecked) {
        window.TrimbleConnectWorkspace.setMenuButtonTitle('mark-checked', 'kontrollitud');
        window.TrimbleConnectWorkspace.setMenuButtonEnabled('mark-checked', false);
      } else {
        window.TrimbleConnectWorkspace.setMenuButtonTitle('mark-checked', 'MÄRGI KONTROLLITUKS');
        window.TrimbleConnectWorkspace.setMenuButtonEnabled('mark-checked', true);
      }
      window.TrimbleConnectWorkspace.setMenuButtonVisible('mark-checked', true);

    } else {
      window.TrimbleConnectWorkspace.setMenuButtonVisible('mark-received', false);
      window.TrimbleConnectWorkspace.setMenuButtonVisible('mark-checked', false);
    }
  });

  window.TrimbleConnectWorkspace.on('menuClick', async function(event) {
    const selection = await window.TrimbleConnectWorkspace.getSelection();
    if (!selection || selection.length === 0) return;

    if (event.id === 'mark-received') {
      await markSelectedAsReceived(selection);
      window.TrimbleConnectWorkspace.showNotification('Valitud tooted saabunud!');
      window.TrimbleConnectWorkspace.setMenuButtonTitle('mark-received', 'saabunud');
      window.TrimbleConnectWorkspace.setMenuButtonEnabled('mark-received', false);
    }
    if (event.id === 'mark-checked') {
      await markSelectedAsChecked(selection);
      window.TrimbleConnectWorkspace.showNotification('Valitud tooted kontrollitud!');
      window.TrimbleConnectWorkspace.setMenuButtonTitle('mark-checked', 'kontrollitud');
      window.TrimbleConnectWorkspace.setMenuButtonEnabled('mark-checked', false);
    }
  });
});
