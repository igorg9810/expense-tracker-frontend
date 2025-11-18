/// <reference types="@welldone-software/why-did-you-render" />
import React from 'react';

if (import.meta.env.DEV) {
  const whyDidYouRender = await import('@welldone-software/why-did-you-render');
  whyDidYouRender.default(React, {
    trackAllPureComponents: false,
    trackHooks: true,
    trackExtraHooks: [
      [React, 'useCallback'],
      [React, 'useMemo'],
    ],
    logOnDifferentValues: true,
    collapseGroups: true,
    include: [/ExpenseTable/, /DraggableExpenseRow/, /Button/, /Modal/, /UploadInvoiceModal/],
  });
}
