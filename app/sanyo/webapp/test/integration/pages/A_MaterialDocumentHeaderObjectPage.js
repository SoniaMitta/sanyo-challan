sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'sanyo',
            componentId: 'A_MaterialDocumentHeaderObjectPage',
            contextPath: '/A_MaterialDocumentHeader'
        },
        CustomPageDefinitions
    );
});