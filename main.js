// Märgi saabunud extension - Trimble Connect 3D Workspace API näide

// Utility: Kontrolli, kas kõik valitud detailid on juba "saabunud"
async function allSelectedAreReceived(selection) {
  for (const object of selection) {
    const props = await window.TrimbleConnectWorkspace.getObjectProperties(object.id);
    if (!props || props["Staatus"] !== "saabunud") {
      return false;
    }
  }
  return true;
}

// Utility: Märgi kõik valitud detailid "saabunuks"
async function markSelectedAsReceived(selection) {
  for (const object of selection) {
    let props = await window.TrimbleConnectWorkspace.getObjectProperties(object.id);
    if (!props) props = {};
    props["Staatus"] = "saabunud";
    await window.TrimbleConnectWorkspace.setObjectProperties(object.id, props);
  }
}

window.addEventListener('load', function() {
  // Kuula valiku muutusi (ainult 3D vaates)
  window.TrimbleConnectWorkspace.on('selectionChanged', async function(selection) {
    const hasSelection = selection && selection.length > 0;
    if (!hasSelection) {
      window.TrimbleConnectWorkspace.setMenuButtonVisible('mark-received', false);
      return;
    }
    // Kui kõik valitud on juba "saabunud", muuda nupu tekstiks "saabunud"
    const alreadyReceived = await allSelectedAreReceived(selection);
    if (alreadyReceived) {
      window.TrimbleConnectWorkspace.setMenuButtonTitle('mark-received', 'saabunud');
      window.TrimbleConnectWorkspace.setMenuButtonEnabled('mark-received', false);
    } else {
      window.TrimbleConnectWorkspace.setMenuButtonTitle('mark-received', 'MÄRGI SAABUNUD');
      window.TrimbleConnectWorkspace.setMenuButtonEnabled('mark-received', true);
    }
    window.TrimbleConnectWorkspace.setMenuButtonVisible('mark-received', true);
  });

  // Kuula nupu vajutust
  window.TrimbleConnectWorkspace.on('menuClick', async function(event) {
    if (event.id !== 'mark-received') return;
    const selection = await window.TrimbleConnectWorkspace.getSelection();
    if (!selection || selection.length === 0) return;

    await markSelectedAsReceived(selection);

    // Pärast muutmist kuva teade
    window.TrimbleConnectWorkspace.showNotification('Valitud tooted saabunud!');

    // Uuenda nuppude olekut pärast muutmist
    window.TrimbleConnectWorkspace.setMenuButtonTitle('mark-received', 'saabunud');
    window.TrimbleConnectWorkspace.setMenuButtonEnabled('mark-received', false);
  });
});
