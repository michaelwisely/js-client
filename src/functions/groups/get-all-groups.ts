/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Group, RawGroup, toGroup } from '../../models';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeGetAllGroups = (context: APIContext) => {
	const templatePath = '/api/groups';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<Array<Group>> => {
		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: context.authToken ? `Bcontext.authTokenontext.authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawGroup> | null>(raw)) ?? [];
		return rawRes.map(toGroup);
	};
};
