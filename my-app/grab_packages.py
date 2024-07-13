import os
import json
import shutil


def rename_npm_package(project_root, output_root, new_name):

    package_json_path = os.path.join(
        project_root, "node_modules", "original-package-name", "package.json"
    )

    new_package_path = os.path.join(output_root, new_name)
    shutil.copytree(os.path.dirname(package_json_path), new_package_path)

    new_package_json_path = os.path.join(new_package_path, "package.json")
    with open(new_package_json_path, "r") as f:
        package_data = json.load(f)

    package_data["name"] = new_name

    with open(new_package_json_path, "w") as f:
        json.dump(package_data, f, indent=2)

    print(f"Package renamed and copied to {new_package_path}")


source_dir = r"C:\Repos\mygithub\uicomp-test\my-app"
target_dir = r"C:\Repos\mygithub\uicomp-test\libs"


def grab_package(package_name: str, new_package_name):
    # if new_package_name==None:
    new_dir_name = package_name.replace("\\", "_").replace("/", "_")
    package_path = os.path.join(source_dir, "node_modules", package_name)
    new_package_path = os.path.join(target_dir, new_dir_name)
    os.makedirs(new_package_path, exist_ok=True)
    shutil.rmtree(new_package_path)
    shutil.copytree(package_path, new_package_path)

    # new_package_json_path = os.path.join(new_package_path, "package.json")
    # with open(new_package_json_path, "r") as f:
    #     package_data = json.load(f)
    # package_data["name"] = new_package_name

    # with open(new_package_json_path, "w") as f:
    #     json.dump(package_data, f, indent=2)

    npmrc_cont = """registry=http://gl.astu.lan/api/v4/projects/108/packages/npm/
//gl.astu.lan/api/v4/projects/108/packages/npm/:_authToken=glpat-M1CpxUYSJ3RSuJGXxSEk
always-auth=true"""
    with open(os.path.join(new_package_path, ".npmrc"), "w") as f:
        f.write(npmrc_cont)
    print(new_package_path)


grab_package("devextreme-quill", "duicomp-quill")
grab_package("devextreme-react", "duicomp-react")
grab_package("devexpress-diagram", "duicomp-diagram")
grab_package("devexpress-gantt", "duicomp-gantt")
grab_package("devextreme", "duicomp")
grab_package(r"@devexpress\utils", "@duibase/utils")
grab_package(r"@devextreme\runtime", "@duicomp/runtime")
