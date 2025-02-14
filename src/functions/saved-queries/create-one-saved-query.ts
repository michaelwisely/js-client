/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableSavedQuery, RawSavedQuery, SavedQuery, toRawCreatableSavedQuery, toSavedQuery } from '../../models';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeCreateOneSavedQuery = (context: APIContext) => {
	const templatePath = '/api/library';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (data: CreatableSavedQuery): Promise<SavedQuery> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: context.authToken ? `Bcontext.authTokenontext.authToken}` : undefined },
				body: JSON.stringify(toRawCreatableSavedQuery(data)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawSavedQuery>(raw);
			return toSavedQuery(rawRes);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};
