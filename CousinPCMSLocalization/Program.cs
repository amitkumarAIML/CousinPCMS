// See https://aka.ms/new-console-template for more information
using Newtonsoft.Json;
using System.Xml.Linq;
using System.IO;
using System.Reflection;
using System.Net.NetworkInformation;

public class Program
{
    public static void Main(string[] args)
    {        
        // var ipAddress = IPProvider.GetLocalIPv4();
       
        TypeScriptInterfacesExtension.GenerateTypeScriptInterfaces(@"..\CousinPCMS.Domain\bin\Debug\net7.0\CousinPCMS.Domain.dll", @"..\VPLocalization\TS\");

        string file1ToBeConverted = @"..\CousinPCMS\Resources\Resources.en-US.resx";
        string pathOfSuperAdminJSONFileWithExtension = @"..\CousinPCMS.Angular\src\assets\i18n\en.json";

        string file1ToBeConverted1 = @"..\CousinPCMS\Resources\Resources.es-mx.resx";
        string pathOfSuperAdminJSONFileWithExtension1 = @"..\CousinPCMS.Angular\src\assets\i18n\sp.json";
       
        bool testMode = false;


        var xml = File.ReadAllText(file1ToBeConverted);

        var obj = new
        {
            Texts = XElement.Parse(xml)
                .Elements("data")
                .Select(el => new
                {
                    id = el.Attribute("name").Value,
                    text = testMode ? "x_" + el.Element("value").Value.Trim() : el.Element("value").Value.Trim()
                })
                .ToList()
        };

        var dictionary = new Dictionary<string, string>();

        foreach (var item in obj.Texts)
        {
            try
            {
                dictionary.Add(item.id, item.text);
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception.Message);
                Console.WriteLine($"Key getting duplicated is: {item.id}");
            }
        }

        string json = JsonConvert.SerializeObject(dictionary, Formatting.Indented);

        if (File.Exists(pathOfSuperAdminJSONFileWithExtension))
        {
            File.Delete(pathOfSuperAdminJSONFileWithExtension);
        }
        File.WriteAllText(pathOfSuperAdminJSONFileWithExtension, json);

        // if (File.Exists(pathOfPartnerAdminJSONFile))
        // {
        //     File.Delete(pathOfPartnerAdminJSONFile);
        // }
        // File.WriteAllText(pathOfPartnerAdminJSONFile, json);

        // if (File.Exists(pathOfCustomerJSONFile))
        // {
        //     File.Delete(pathOfCustomerJSONFile);
        // }
        // File.WriteAllText(pathOfCustomerJSONFile, json);




        xml = File.ReadAllText(file1ToBeConverted1);

        obj = new
        {
            Texts = XElement.Parse(xml)
                .Elements("data")
                .Select(el => new
                {
                    id = el.Attribute("name").Value,
                    text = testMode ? "x_" + el.Element("value").Value.Trim() : el.Element("value").Value.Trim()
                })
                .ToList()
        };

        dictionary = new Dictionary<string, string>();

        foreach (var item in obj.Texts)
        {
            try
            {
                dictionary.Add(item.id, item.text);
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception.Message);
                Console.WriteLine($"Key getting duplicated is: {item.id}");
            }
        }

        json = JsonConvert.SerializeObject(dictionary, Formatting.Indented);

        if (File.Exists(pathOfSuperAdminJSONFileWithExtension1))
        {
            File.Delete(pathOfSuperAdminJSONFileWithExtension1);
        }
        File.WriteAllText(pathOfSuperAdminJSONFileWithExtension1, json);

        // if (File.Exists(pathOfPartnerAdminJSONFile1))
        // {
        //     File.Delete(pathOfPartnerAdminJSONFile1);
        // }
        // File.WriteAllText(pathOfPartnerAdminJSONFile1, json);

        // if (File.Exists(pathOfCustomerJSONFile1))
        // {
        //     File.Delete(pathOfCustomerJSONFile1);
        // }
        // File.WriteAllText(pathOfCustomerJSONFile1, json);


        Console.WriteLine("Files created successfully.");
    }
}

 public static class IPProvider
    {
        public static string GetLocalIPv4()
        {
            string ipAddress = string.Empty;

            try
            {
                var networkInterfaces = NetworkInterface.GetAllNetworkInterfaces()
                    .Where(i => i.OperationalStatus == OperationalStatus.Up && i.NetworkInterfaceType != NetworkInterfaceType.Loopback);

                foreach (var networkInterface in networkInterfaces)
                {
                    var ipProperties = networkInterface.GetIPProperties();
                    var ipAddresses = ipProperties.UnicastAddresses;

                    foreach (var ipAddressInfo in ipAddresses)
                    {
                        if (ipAddressInfo.Address.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
                        {
                            ipAddress = ipAddressInfo.Address.ToString();
                            break;
                        }
                    }

                    if (!string.IsNullOrEmpty(ipAddress))
                        break;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
            }

            return ipAddress;
        }
    }

/// <summary>
/// SINCERE THANKS TO: https://github.com/lmcarreiro/cs2ts-example
/// </summary>
public static class TypeScriptInterfacesExtension
{
    private static Type[] nonPrimitivesExcludeList = new Type[]
    {
            typeof(object),
            typeof(string),
            typeof(decimal),
            typeof(void),
    };

    private static IDictionary<Type, string> convertedTypes = new Dictionary<Type, string>()
    {
        [typeof(string)] = "string",
        [typeof(char)] = "string",
        [typeof(byte)] = "number",
        [typeof(sbyte)] = "number",
        [typeof(short)] = "number",
        [typeof(ushort)] = "number",
        [typeof(int)] = "number",
        [typeof(uint)] = "number",
        [typeof(long)] = "number",
        [typeof(ulong)] = "number",
        [typeof(float)] = "number",
        [typeof(double)] = "number",
        [typeof(decimal)] = "number",
        [typeof(bool)] = "boolean",
        [typeof(object)] = "any",
        [typeof(void)] = "void",
        [typeof(DateTime)] = "Date",
    };


    public static void GenerateTypeScriptInterfaces(string filePathOfDLL, string path)
    {
        if (Directory.Exists(path))
        {
            Directory.Delete(path, true);
        }

        var assembly = Assembly.LoadFrom(filePathOfDLL);
        Type[] typesToConvert = assembly.GetTypes();

        foreach (Type type in typesToConvert)
        {
            var tsType = ConvertCs2Ts(type);
            string fullPath = Path.Combine(path, tsType.Name);

            string directory = Path.GetDirectoryName(fullPath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            File.WriteAllLines(fullPath, tsType.Lines);
        }
    }

    private static (string Name, string[] Lines) ConvertCs2Ts(Type type)
    {
        string filename = $"{type.Namespace.Replace(".", "/")}/{type.Name}.ts";

        Type[] types = GetAllNestedTypes(type);

        var lines = new List<string>();

        foreach (Type t in types)
        {
            lines.Add($"");

            if (t.IsClass || t.IsInterface)
            {
                ConvertClassOrInterface(lines, t);
            }
            else if (t.IsEnum)
            {
                ConvertEnum(lines, t);
            }
            else
            {
                //throw new InvalidOperationException();
            }
        }

        return (filename, lines.ToArray());
    }

    private static void ConvertClassOrInterface(IList<string> lines, Type type)
    {
        lines.Add($"export class {type.Name} {{");

        foreach (PropertyInfo property in type.GetProperties().Where(p => p.GetMethod.IsPublic))
        {
            if (property.Name != "CustomerLogo")
            {
                Type propType = property.PropertyType;
                Type arrayType = GetArrayOrEnumerableType(propType);
                Type nullableType = GetNullableType(propType);

                Type typeToUse = nullableType ?? arrayType ?? propType;


                var convertedType = ConvertType(typeToUse);

                string suffix = "";
                suffix = arrayType != null ? "[]" : suffix;
                suffix = nullableType != null ? "|null" : suffix;

                lines.Add($"  {CamelCaseName(property.Name)}: {convertedType}{suffix};"); 
            }
        }

        lines.Add($"}}");
    }

    private static string ConvertType(Type typeToUse)
    {
        if (convertedTypes.ContainsKey(typeToUse))
        {
            return convertedTypes[typeToUse];
        }

        if (typeToUse.IsConstructedGenericType && typeToUse.GetGenericTypeDefinition() == typeof(IDictionary<,>))
        {
            var keyType = typeToUse.GenericTypeArguments[0];
            var valueType = typeToUse.GenericTypeArguments[1];
            return $"{{ [key: {ConvertType(keyType)}]: {ConvertType(valueType)} }}";
        }

        return typeToUse.Name;
    }

    private static void ConvertEnum(IList<string> lines, Type type)
    {
        var enumValues = type.GetEnumValues().Cast<int>().ToArray();
        var enumNames = type.GetEnumNames();

        lines.Add($"export enum {type.Name} {{");

        for (int i = 0; i < enumValues.Length; i++)
        {
            lines.Add($"  {enumNames[i]} = {enumValues[i]},");
        }

        lines.Add($"}}");
    }

    private static Type[] GetAllNestedTypes(Type type)
    {
        return new Type[] { type }
            .Concat(type.GetNestedTypes().SelectMany(nt => GetAllNestedTypes(nt)))
            .ToArray();
    }

    private static Type GetArrayOrEnumerableType(Type type)
    {
        if (type.IsArray)
        {
            return type.GetElementType();
        }

        else if (type.IsConstructedGenericType)
        {
            Type typeArgument = type.GenericTypeArguments.First();

            if (typeof(IEnumerable<>).MakeGenericType(typeArgument).IsAssignableFrom(type))
            {
                return typeArgument;
            }
        }

        return null;
    }

    private static Type GetNullableType(Type type)
    {
        if (type.IsConstructedGenericType)
        {
            Type typeArgument = type.GenericTypeArguments.First();

            if (typeArgument.IsValueType && typeof(Nullable<>).MakeGenericType(typeArgument).IsAssignableFrom(type))
            {
                return typeArgument;
            }
        }

        return null;
    }

    private static string CamelCaseName(string pascalCaseName)
    {
        return pascalCaseName[0].ToString().ToLower() + pascalCaseName.Substring(1);
    }
}