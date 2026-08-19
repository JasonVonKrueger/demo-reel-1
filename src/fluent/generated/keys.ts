import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: 'df29e76ecd3040d59f53bdfb5d400094'
                    }
                    br0: {
                        table: 'sys_script'
                        id: '0c7022e5a3bc45de992b996b65691053'
                    }
                    cs0: {
                        table: 'sys_script_client'
                        id: '467b80b517a1403d8d5ce0d6d25f71dc'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '2a5cdb29f5da4b359486d32163728904'
                    }
                    src_server_script_ts: {
                        table: 'sys_module'
                        id: '48840257512b448a97c75563be5f57f1'
                    }
                }
                composite: [
                    {
                        table: 'sys_ux_lib_asset'
                        id: '0f9416b2cd5949b5bf9fcf3243aedfab'
                        key: {
                            name: 'x_1892699_demoreel/main'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'f958fdc27f1d4310bc38f9f072b9c63a'
                        key: {
                            name: 'x_1892699_demoreel/main.js.map'
                        }
                    },
                ]
            }
        }
    }
}
