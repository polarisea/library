import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../services/api";

export const createContract = createAsyncThunk(
  "contract/createContract",
  async (body, { dispatch }) => {
    dispatch(contractSlice.actions.setLastAction("createContract"));
    const { data } = await apiService.post(`contracts`, {
      ...body,
    });
    return data;
  }
);

export const updateContract = createAsyncThunk(
  "contract/updateContract",
  async ({ id, body }, { dispatch }) => {
    dispatch(contractSlice.actions.setLastAction("updateContract"));
    const { data } = await apiService.patch(`contracts/${id}/update`, {
      ...body,
    });
    return data;
  }
);

export const fetchContracts = createAsyncThunk(
  "contract/fetchContracts",
  async (params, { dispatch }) => {
    dispatch(contractSlice.actions.setLastAction("fetchContracts"));
    const { data } = await apiService.get(`contracts`, {
      params,
    });
    return data;
  }
);

export const fetchContract = createAsyncThunk(
  "contract/fetchContract",
  async (params, { dispatch }) => {
    dispatch(contractSlice.actions.setLastAction("fetchContract"));
    const { data } = await apiService.get(`contracts`, {
      params,
    });
    return data;
  }
);

export const fetchTotal = createAsyncThunk(
  "contract/fetchTotal",
  async (params) => {
    const { data } = await apiService.get(`contracts/count`, {
      params: {
        ...params,
      },
    });
    return data;
  }
);

export const cancelRequest = createAsyncThunk(
  "contract/cancelRequest",
  async (contractId, { dispatch }) => {
    dispatch(contractSlice.actions.setLastAction("cancelRequest"));
    const { data } = await apiService.delete(`contracts/${contractId}/cancel`);
    return data;
  }
);

export const refuseRequest = createAsyncThunk(
  "contract/refuseRequest",
  async (contractId, { dispatch }) => {
    dispatch(contractSlice.actions.setLastAction("refuseRequest"));
    const { data } = await apiService.delete(`contracts/${contractId}/refuse`);
    return data;
  }
);

const contractSlice = createSlice({
  name: "contract",
  initialState: {
    contracts: [],
    contract: null,
    loading: false,
    error: null,
    total: 0,
    lastAction: null,
  },
  reducers: {
    setLastAction(state, action) {
      state.lastAction = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createContract.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.contract = action.payload;
        state.loading = false;
      })
      .addCase(createContract.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
    builder
      .addCase(updateContract.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(updateContract.fulfilled, (state, action) => {
        state.contract = action.payload;
        state.loading = false;
      })
      .addCase(updateContract.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
    builder
      .addCase(fetchContracts.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.contracts = action.payload;
        state.loading = false;
      })
      .addCase(fetchContracts.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
    builder
      .addCase(fetchContract.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchContract.fulfilled, (state, action) => {
        state.contract = action.payload[0];
        state.loading = false;
      })
      .addCase(fetchContract.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
    builder
      .addCase(fetchTotal.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchTotal.fulfilled, (state, action) => {
        state.total = action.payload;
      })
      .addCase(fetchTotal.rejected, (state) => {
        state.error = true;
      });

    builder
      .addCase(cancelRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelRequest.fulfilled, (state, action) => {
        state.contract = null;
        state.loading = false;
      })
      .addCase(cancelRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
    builder
      .addCase(refuseRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refuseRequest.fulfilled, (state, action) => {
        state.contract = null;
        state.loading = false;
      })
      .addCase(refuseRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

// Export reducer và actions từ slice
export const { setLastAction } = contractSlice.actions;

export default contractSlice;
