# Pallet State
#
# Written by Mohammed Alsadi
# -----------------------------------------------------------------------------

import hashlib
import json
import logging


LOGGER = logging.getLogger(__name__)


PALLET_NAMESPACE = hashlib.sha512(
    'pallet'.encode('utf-8')).hexdigest()[0:6]


def _get_address(palletId):
    adr = hashlib.sha512(palletId.encode('utf-8')).hexdigest()[:62]
    LOGGER.info(adr)
    return adr


def _get_pallet_address(palletId):
    add =  PALLET_NAMESPACE + '00' + _get_address(palletId)
    LOGGER.info(add)
    return add


def _deserialize(data):
    return json.loads(data.decode('utf-8'))


def _serialize(data):
    return json.dumps(data, sort_keys=True).encode('utf-8')


class PalletState(object):

    TIMEOUT = 3

    def __init__(self, context):
        self._context = context

    def get_pallet(self, palletId):
        return self._get_state(_get_pallet_address(palletId))


    def set_pallet(self, palletId, palletVid, palletNumber, date, weight, productId, productNumber):
        address = _get_pallet_address(palletId)
        LOGGER.info('set_pallet method')
        LOGGER.info(address)
        state_data = _serialize(
            {   "palletId": palletId,
                "palletVid": palletVid,
                "palletNumber": palletNumber,
                "date": date,
                "weight": weight,
                "productId": productId,
                "productNumber": productNumber

            })
        return self._context.set_state(
            {address: state_data}, timeout=self.TIMEOUT)

    def _get_state(self, address):
        state_entries = self._context.get_state(
            [address], timeout=self.TIMEOUT)
        if state_entries:
            entry = _deserialize(data=state_entries[0].data)
        else:
            entry = None
        return entry
