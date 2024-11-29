sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'sanyo',
            componentId: 'A_MaterialDocumentItemObjectPage',
            contextPath: '/A_MaterialDocumentHeader/to_MaterialDocumentItem'
        },
        CustomPageDefinitions
    );
});