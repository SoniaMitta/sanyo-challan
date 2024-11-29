sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'sanyo/test/integration/FirstJourney',
		'sanyo/test/integration/pages/A_MaterialDocumentHeaderList',
		'sanyo/test/integration/pages/A_MaterialDocumentHeaderObjectPage',
		'sanyo/test/integration/pages/A_MaterialDocumentItemObjectPage'
    ],
    function(JourneyRunner, opaJourney, A_MaterialDocumentHeaderList, A_MaterialDocumentHeaderObjectPage, A_MaterialDocumentItemObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('sanyo') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheA_MaterialDocumentHeaderList: A_MaterialDocumentHeaderList,
					onTheA_MaterialDocumentHeaderObjectPage: A_MaterialDocumentHeaderObjectPage,
					onTheA_MaterialDocumentItemObjectPage: A_MaterialDocumentItemObjectPage
                }
            },
            opaJourney.run
        );
    }
);